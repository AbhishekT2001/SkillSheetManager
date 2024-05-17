using System.Security.Cryptography;
using System.Text;

namespace SkillSheetManager.Models
{
    /// <summary>
    /// Encrypt and Decrypt the User Password
    /// </summary>
    public class EncryptDecryptPassword
    {
        #region private variable
        private readonly static string key = "SkillSheetManager2024".PadRight(32, '\0').Substring(0, 32);
        #endregion

        #region public methods
        /// <summary>
        /// Encrypt the password
        /// </summary>
        /// <param name="plainText"> Password to be Encrypted </param>
        /// <returns></returns>
        public static byte[] Encrypt(string plainText)
        {
            byte[] encryptedBytes;
            byte[] iv = new byte[16];

            if(string.IsNullOrWhiteSpace(plainText)) return null;

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(key);
                aesAlg.IV = iv;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(plainText);
                        }
                        encryptedBytes = msEncrypt.ToArray();
                    }
                }
            }
            return encryptedBytes;
        }

        /// <summary>
        /// Decrypt the password
        /// </summary>
        /// <param name="cipherBytes"> Password to be Decrypted </param>
        /// <returns> Decrypted Password </returns>
        public static string Decrypt(byte[] cipherBytes)
        {
            string decryptedText = null;
            byte[] iv = new byte[16]; 

            byte[] buffer = new byte[16];
            Buffer.BlockCopy(cipherBytes, 0, buffer, 0, 16);

            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Encoding.UTF8.GetBytes(key);
                aesAlg.IV = iv;

                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msDecrypt = new MemoryStream(buffer))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            decryptedText = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }
            return decryptedText;
        }
        #endregion
    }
}