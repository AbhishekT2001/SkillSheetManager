using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSheetManager.Models
{
    /// <summary>
    /// Login Details model class
    /// </summary>
    [Table("LoginDetails")]
    public class LoginDetails
    {
        #region public properties
        [Key]
        public int UserId { get; set; }
        public int Role_Id { get; set; }
        public string UserName { get; set; }
        public byte[] Password { get; set; } 
        public string Email { get; set; }
        public bool Del_Flg { get; set; }
        public DateTime Reg_Date { get; set; }
        public DateTime? Upd_Date { get; set; }
        #endregion
    }
}
