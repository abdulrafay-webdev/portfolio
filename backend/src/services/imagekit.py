"""
ImageKit service for image upload and management.
"""

import httpx
import base64
import hmac
import hashlib
import time
from typing import Optional

from src.config import settings


class ImageKitService:
    """Service for ImageKit operations."""

    def __init__(self):
        self.public_key = settings.imagekit_public_key
        self.private_key = settings.imagekit_private_key
        self.url_endpoint = settings.imagekit_url_endpoint

    def get_authentication_parameters(self) -> dict:
        """Generate ImageKit authentication parameters for client-side upload."""
        expire = int(time.time() * 1000) + 3600000  # 1 hour expiry

        to_sign = f"{expire}"
        signature = hmac.new(
            self.private_key.encode('utf-8'),
            to_sign.encode('utf-8'),
            hashlib.sha1
        ).digest()
        encoded_signature = base64.b64encode(signature).decode('utf-8')

        return {
            'expire': expire,
            'signature': encoded_signature,
            'public_key': self.public_key,
            'url_endpoint': self.url_endpoint,
        }

    def upload_file(self, file_data: bytes, file_name: str, folder: str = 'portfolio') -> dict:
        """
        Upload a file to ImageKit.

        Args:
            file_data: File bytes
            file_name: Original file name
            folder: Folder in ImageKit

        Returns:
            dict with url, fileId, etc.
        """
        url = "https://upload.imagekit.io/api/v1/files/upload"

        # Prepare the file data
        file_data_base64 = base64.b64encode(file_data).decode('utf-8')
        mime_type = self._get_mime_type(file_name)
        file_uri = f"data:{mime_type};base64,{file_data_base64}"

        # Prepare form data
        form_data = {
            'file': file_uri,
            'fileName': file_name,
            'folder': folder,
        }

        # Make request with httpx instead of requests
        with httpx.Client() as client:
            response = client.post(
                url,
                data=form_data,
                auth=(self.private_key, '')
            )

        if response.status_code == 200:
            data = response.json()
            return {
                'url': data.get('url'),
                'fileId': data.get('fileId'),
                'name': data.get('name'),
                'size': data.get('size'),
                'fileType': data.get('fileType'),
            }
        else:
            raise Exception(f"ImageKit upload failed: {response.text}")

    def _get_mime_type(self, filename: str) -> str:
        """Get MIME type from filename extension."""
        extensions = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
        }

        ext = '.' + filename.split('.')[-1].lower()
        return extensions.get(ext, 'application/octet-stream')


# Singleton instance
imagekit_service = ImageKitService()
