// Encryption utility for private poems
export class EncryptionService {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();

  static async generateKey(password: string): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      this.encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: this.encoder.encode('poeset-salt-v1'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(text: string, password: string): Promise<string> {
    try {
      const key = await this.generateKey(password);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        this.encoder.encode(text)
      );

      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt content');
    }
  }

  static async decrypt(encryptedText: string, password: string): Promise<string> {
    try {
      const key = await this.generateKey(password);
      const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);

      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );

      return this.decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt content - wrong password?');
    }
  }
}
