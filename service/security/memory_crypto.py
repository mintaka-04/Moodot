"""
memories.text_ciphertext 복호화 (AES-256-GCM)
Node.js memory-text-crypto.ts와 동일한 포맷
"""
import base64
import os
import re
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

AUTH_TAG_LENGTH = 16
_cached_key: bytes | None = None


def _load_key() -> bytes:
    global _cached_key
    if _cached_key:
        return _cached_key

    raw = os.getenv("MEMORY_TEXT_ENCRYPTION_KEY", "").strip()
    if not raw:
        raise ValueError("MEMORY_TEXT_ENCRYPTION_KEY is missing.")

    if re.fullmatch(r"[0-9a-fA-F]{64}", raw):
        key = bytes.fromhex(raw)
    else:
        key = base64.b64decode(raw)
        if len(key) != 32:
            key = raw.encode("utf-8")

    if len(key) != 32:
        raise ValueError("MEMORY_TEXT_ENCRYPTION_KEY must be 32 bytes.")

    _cached_key = key
    return _cached_key


def decrypt_memory_text(text_ciphertext: str | None, text_iv: str | None, text: str | None = None) -> str | None:
    """DB 레코드의 text_ciphertext를 복호화해 평문 반환.
    text_ciphertext가 없으면 legacy text 그대로 반환."""
    if not text_ciphertext:
        return text

    if not text_iv:
        raise ValueError("Encrypted memory text is missing its IV.")

    payload = base64.b64decode(text_ciphertext)
    ciphertext = payload[:-AUTH_TAG_LENGTH]
    auth_tag = payload[-AUTH_TAG_LENGTH:]
    iv = base64.b64decode(text_iv)

    aesgcm = AESGCM(_load_key())
    decrypted = aesgcm.decrypt(iv, ciphertext + auth_tag, None)
    return decrypted.decode("utf-8")
