using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Squeeby_App.Helpers
{
    [Authorize]
    public class SqueebySecureController : SqueebyControllerBase
    {

        //public Customer CurrentCustomer()
        //{

        //    return CustomerService.GetCustomer(UserId);
        //}

        public int UserId
        {
            get
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier).Value; // will give the user's userId
                return Convert.ToInt32(userId);
            }
        }

        protected IActionResult JsonContent<T>(T dataObject)
        {
            return new ContentResult
            {
                StatusCode = (int)HttpStatusCode.OK,
                Content = JsonConvert.SerializeObject(dataObject),
                ContentType = "application/json"
            };
        }
    }
}
