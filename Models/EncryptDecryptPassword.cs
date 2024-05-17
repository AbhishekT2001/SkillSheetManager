
using System.Security.Cryptography;
using System.Text;

namespace SkillSheetManager.Models
{
    public class EncryptDecryptPassword
    {
        private readonly static string key = "YourKeyHere1234567890123456".PadRight(32, '\0').Substring(0, 32);

        public static byte[] Encrypt(string text)
        {
            byte[] iv = new byte[16];

            byte[] encryptedBytes;
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter(cryptoStream))
                        {
                            streamWriter.Write(text);
                        }
                        cryptoStream.FlushFinalBlock();
                        encryptedBytes = ms.ToArray();
                    }
                }
            }


            return encryptedBytes;
        }

        public static string Decrypt(byte[] cipherHex)
        {
            byte[] iv = new byte[16];

            // Take only the first 16 bytes of the cipherHex array
            byte[] buffer = new byte[16];
            Buffer.BlockCopy(cipherHex, 0, buffer, 0, 16);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
                using (MemoryStream ms = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader(cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }
    }
}