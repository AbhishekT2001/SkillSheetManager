using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSheetManager.Models
{
    [Table("Role")]
    public class Role
    {
        public byte Id { get; set; }
        public string Name { get; set; }
        public char Del_flg { get; set; }
        public DateTime Reg_Date { get; set; }
        public DateTime? Upd_date { get; set; }
    }

}
