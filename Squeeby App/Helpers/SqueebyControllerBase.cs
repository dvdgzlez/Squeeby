using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Squeeby_App.Models;

namespace Squeeby_App.Helpers
{
    public class SqueebyControllerBase: Controller
    {

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        protected IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        protected IActionResult Error(ErrorViewModel model)
        {
            return View("Error", model);
        }

    }
}
