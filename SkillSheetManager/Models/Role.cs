using System.ComponentModel.DataAnnotations.Schema;

namespace SkillSheetManager.Models
{
    /// <summary>
    /// Role table Model
    /// </summary>
    [Table("Role")]
    public class Role
    {
        #region Public Properties
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Del_Flg { get; set; }
        public DateTime Reg_Date { get; set; }
        public DateTime? Upd_Date { get; set; }
        #endregion
    }

}
