namespace SkillSheetManager.Models.ManagerUser
{
    /// <summary>
    /// update user request
    /// </summary>
    public class UpdateUserRequest
    {
        #region public properties
        public int Id { get; set; }
        public string Role { get; set; }
        public String UserName { get; set; }
        public string Password{ get; set; }
        public String Email { get; set; }
        #endregion
    }
}
