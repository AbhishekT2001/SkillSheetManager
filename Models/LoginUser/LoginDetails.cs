using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSheetManager.Models
{
    [Table("LoginDetails")]
    public class LoginDetails
    {
        public int Id { get; set; }
        public byte RoleId { get; set; }
        public string UserName { get; set; }
        public byte[] Password { get; set; } 
        public string Email { get; set; }
        public char DelFlg { get; set; }
        public DateTime RegDate { get; set; }
        public DateTime? UpdDate { get; set; }
       
    }
}
