using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSheetManager.Models;
using System.Diagnostics;

namespace SkillSheetManager.Controllers
{
    /// <summary>
    /// Api controller Home for loading the Views
    /// </summary>
    public class HomeController : Controller
    {
        #region Private Variables
        /// <summary>
        /// Logger
        /// </summary>        
        private readonly ILogger<HomeController> _logger;
        #endregion

        #region Constructor
        /// <summary>
        /// Parameterized Constructor
        /// </summary>
        /// <param name="logger"> Logger </param>
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
        #endregion

        #region Public Method

        /// <summary>
        /// Loads Login View
        /// </summary>
        /// <returns> Login View </returns>
        
        public IActionResult Login()
        {
            return View();
        }

        /// <summary>
        /// Loads Personal Details View
        /// </summary>
        /// <returns> Personal Details View </returns>
        [Authorize]
        
        public IActionResult PersonalDetails()
        {
            return View();
        }

        [Authorize]
        
        public IActionResult ManageUser()
        {
            return View();
        }

        /// <summary>
        /// Loads Change Password View
        /// </summary>
        /// <returns> Change Password View </returns>
        [Authorize]
        
        public IActionResult ChangePassword()
        {
            return View();
        }

        /// <summary>
        /// Loads Logout View
        /// </summary>
        /// <returns> Logout View </returns>
        
        public async Task<IActionResult> Logout()
        {
            HttpContext.Session.Clear();

            await HttpContext.SignOutAsync();

            return RedirectToAction("Login", "Home");
        }

        /// <summary>
        /// Loads Error View
        /// </summary>
        /// <returns> Error View </returns>
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        #endregion
    }
}
