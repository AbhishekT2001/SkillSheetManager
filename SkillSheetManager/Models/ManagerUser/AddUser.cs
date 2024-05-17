namespace SkillSheetManager.Models.ManagerUser
{
    /// <summary>
    /// add user request
    /// </summary>
    public class AddUser
    {
        #region public Properties
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        #endregion
    }
}
