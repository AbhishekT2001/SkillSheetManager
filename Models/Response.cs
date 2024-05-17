namespace SkillSheetManager
{
    public class LoginResponse
    {
        public int ResultInfo { get; set; }
        public string UserName { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int? ErrorCode { get; set; }
        public string ErrorMessage { get; set; }
    }
}