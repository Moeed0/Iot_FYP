"""
IIFVS - Flask Backend with Binwalk + NVD CVE Integration
=========================================================
Copy this file to your Kali Linux at: ~/IIFVS-BACKEND/app.py
Replace your current app.py with this version.

Run:
    pip install flask flask-cors requests
    python app.py

Endpoints:
    POST /upload       - Upload firmware + Binwalk extraction
    GET  /nvd-search   - Search NVD CVE database
    POST /api/auth/login    - Mock login
    POST /api/auth/register - Mock register
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os
import requests
import json
import re

app = Flask(__name__)
CORS(app)  # Allow React frontend to connect

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ============================================================
# ROOT ROUTE
# ============================================================
@app.route('/')
def index():
    return jsonify({
        "application": "IIFVS - IoT Firmware Vulnerability Detection",
        "status": "running",
        "endpoints": {
            "POST /upload": "Upload firmware for Binwalk extraction",
            "GET /nvd-search?keyword=openssl": "Search NVD CVE database",
            "POST /api/auth/login": "Mock authentication",
            "POST /api/auth/register": "Mock registration"
        }
    })


# ============================================================
# FIRMWARE UPLOAD + BINWALK EXTRACTION
# ============================================================
@app.route('/upload', methods=['POST'])
def upload_firmware():
    if 'firmware' not in request.files:
        return jsonify({"error": "No firmware file provided"}), 400

    firmware = request.files['firmware']
    if firmware.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Save uploaded file
    filepath = os.path.join(UPLOAD_FOLDER, firmware.filename)
    firmware.save(filepath)

    # Run Binwalk extraction
    try:
        result = subprocess.run(
            ['binwalk', '-e', filepath],
            capture_output=True,
            text=True,
            timeout=120
        )
        binwalk_output = result.stdout

        # Parse binwalk output into structured components
        components = parse_binwalk_output(binwalk_output)
        
        # Intelligent Software Detection
        detected_versions = extract_software_versions(binwalk_output)
        prime_keyword = detected_versions[0] if detected_versions else "IoT Firmware"

        # Check for extracted directory
        extract_dir = filepath + '.extracted' if os.path.exists(filepath + '.extracted') else None
        extracted_files = []
        if extract_dir and os.path.isdir(extract_dir):
            for root, dirs, files in os.walk(extract_dir):
                for f in files:
                    full_path = os.path.join(root, f)
                    rel_path = os.path.relpath(full_path, extract_dir)
                    size = os.path.getsize(full_path)
                    extracted_files.append({
                        "name": rel_path,
                        "size": format_size(size),
                        "type": get_file_type(f)
                    })

        # Also try _firmware.extracted directory pattern
        alt_extract = os.path.join(UPLOAD_FOLDER, '_' + firmware.filename + '.extracted')
        if os.path.isdir(alt_extract) and not extracted_files:
            for root, dirs, files in os.walk(alt_extract):
                for f in files:
                    full_path = os.path.join(root, f)
                    rel_path = os.path.relpath(full_path, alt_extract)
                    size = os.path.getsize(full_path)
                    extracted_files.append({
                        "name": rel_path,
                        "size": format_size(size),
                        "type": get_file_type(f)
                    })

        return jsonify({
            "status": "extracted",
            "filename": firmware.filename,
            "file_size": os.path.getsize(filepath),
            "binwalk_output": binwalk_output,
            "components": components if components else extracted_files,
            "extracted_files_count": len(extracted_files),
            "detected_versions": detected_versions,
            "prime_keyword": prime_keyword
        })

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Binwalk extraction timed out"}), 500
    except FileNotFoundError:
        return jsonify({"error": "Binwalk not found. Install with: sudo apt install binwalk"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def extract_software_versions(output):
    """Extract software versions from binwalk output using regex."""
    software_patterns = [
        r"(BusyBox\s+v?[\d\.]+)",
        r"(OpenSSL\s+[\d\.]+[a-z]?)",
        r"(Linux kernel\s+[\d\.]+)",
        r"(U-Boot\s+[\d\.]+)",
        r"(Dropbear\s+[\d\.]+)",
        r"(Dnsmasq\s+[\d\.]+)"
    ]
    detected = []
    for pattern in software_patterns:
        matches = re.findall(pattern, output, re.IGNORECASE)
        for match in matches:
            if match not in detected:
                detected.append(match)
    return detected


def parse_binwalk_output(output):
    """Parse binwalk text output into structured components."""
    components = []
    lines = output.strip().split('\n')
    for line in lines:
        line = line.strip()
        if not line or line.startswith('DECIMAL') or line.startswith('-'):
            continue
        parts = line.split(None, 2)
        if len(parts) >= 3:
            try:
                offset = parts[0]
                hex_offset = parts[1]
                description = parts[2]
                components.append({
                    "name": description.split(',')[0].strip(),
                    "type": description,
                    "offset": hex_offset,
                    "size": "N/A"
                })
            except (ValueError, IndexError):
                continue
    return components


def format_size(size_bytes):
    """Format bytes into human readable size."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"


def get_file_type(filename):
    """Guess file type from extension."""
    ext_map = {
        '.bin': 'Binary data',
        '.elf': 'ELF executable',
        '.gz': 'gzip compressed data',
        '.tar': 'tar archive',
        '.squashfs': 'Squashfs filesystem',
        '.jffs2': 'JFFS2 filesystem',
        '.cramfs': 'CramFS filesystem',
        '.cpio': 'CPIO archive',
        '.lzma': 'LZMA compressed data',
        '.xz': 'XZ compressed data',
        '.conf': 'Configuration file',
        '.pem': 'PEM certificate',
        '.key': 'Private key',
        '.so': 'Shared library',
    }
    _, ext = os.path.splitext(filename.lower())
    return ext_map.get(ext, 'Unknown file type')


# ============================================================
# NVD CVE DATABASE SEARCH
# ============================================================
@app.route('/nvd-search', methods=['GET'])
def nvd_search():
    keyword = request.args.get('keyword', '')
    if not keyword:
        return jsonify({"error": "keyword parameter required"}), 400

    try:
        # NVD CVE API v2.0
        url = "https://services.nvd.nist.gov/rest/json/cves/2.0"
        params = {
            "keywordSearch": keyword,
            "resultsPerPage": 50
        }

        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        vulnerabilities = []
        for item in data.get('vulnerabilities', []):
            cve = item.get('cve', {})
            cve_id = cve.get('id', 'Unknown')

            # Get description
            descriptions = cve.get('descriptions', [])
            description = ''
            for desc in descriptions:
                if desc.get('lang') == 'en':
                    description = desc.get('value', '')
                    break

            # Get CVSS score and severity
            cvss_score = 0.0
            severity = 'low'
            metrics = cve.get('metrics', {})

            # Try CVSS v3.1 first, then v3.0, then v2
            if 'cvssMetricV31' in metrics:
                cvss_data = metrics['cvssMetricV31'][0].get('cvssData', {})
                cvss_score = cvss_data.get('baseScore', 0.0)
                severity = cvss_data.get('baseSeverity', 'LOW').lower()
            elif 'cvssMetricV30' in metrics:
                cvss_data = metrics['cvssMetricV30'][0].get('cvssData', {})
                cvss_score = cvss_data.get('baseScore', 0.0)
                severity = cvss_data.get('baseSeverity', 'LOW').lower()
            elif 'cvssMetricV2' in metrics:
                cvss_data = metrics['cvssMetricV2'][0].get('cvssData', {})
                cvss_score = cvss_data.get('baseScore', 0.0)
                if cvss_score >= 9.0:
                    severity = 'critical'
                elif cvss_score >= 7.0:
                    severity = 'high'
                elif cvss_score >= 4.0:
                    severity = 'medium'
                else:
                    severity = 'low'

            vulnerabilities.append({
                "cve_id": cve_id,
                "description": description,
                "cvss_score": cvss_score,
                "severity": severity,
                "published": cve.get('published', ''),
                "last_modified": cve.get('lastModified', '')
            })

        return jsonify({
            "keyword": keyword,
            "total_results": data.get('totalResults', 0),
            "vulnerabilities": vulnerabilities
        })

    except requests.exceptions.Timeout:
        return jsonify({"error": "NVD API request timed out"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"NVD API error: {str(e)}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
# MOCK AUTHENTICATION (for prototype)
# ============================================================
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '')
    password = data.get('password', '')

    # Mock authentication - accept any credentials for prototype
    return jsonify({
        "status": "success",
        "message": "Login successful",
        "user": {
            "email": email,
            "role": "Security Analyst",
            "token": "mock-jwt-token-iifvs-2024"
        }
    })


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}

    return jsonify({
        "status": "success",
        "message": "Registration successful",
        "user": {
            "email": data.get('email', ''),
            "organization": data.get('orgName', ''),
            "role": data.get('role', 'analyst')
        }
    })


# ============================================================
# RUN SERVER
# ============================================================
if __name__ == '__main__':
    print("\n==========================================")
    print("  IIFVS Backend - Flask Server")
    print("  Firmware Extraction + NVD CVE Lookup")
    print("==========================================")
    print("  Endpoints:")
    print("    POST /upload          - Upload firmware")
    print("    GET  /nvd-search      - Search NVD CVEs")
    print("    POST /api/auth/login  - Mock login")
    print("==========================================\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
