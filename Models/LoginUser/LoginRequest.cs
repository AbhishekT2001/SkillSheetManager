using System.ComponentModel.DataAnnotations;

namespace SkillSheetManager.Models
{
    public class LoginRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
