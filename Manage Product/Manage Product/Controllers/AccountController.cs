using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MP.Domain.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Manage_Product.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;

        public AccountController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        // Register Method
        [HttpPost("[action]")]
        public async Task<IActionResult> Register([FromBody] RegisterView formdata)
        {
            // Hold all the errors related to registration
            List<string> errorList = new List<string>();

            var user = new IdentityUser
            {
                Email = formdata.Email,
                UserName = formdata.Username,
            };

            var result = await _userManager.CreateAsync(user, formdata.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Customer");

                // Sending Confirmation Email
                return Ok(new { userName = user.UserName, email = user.Email, status = 1, message = "Registration Successful" });
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);
                }
            }
            return BadRequest(new JsonResult(errorList));
        }

        // Login Method
        [HttpPost("[action]")]
        public async Task<IActionResult> LogIn([FromBody] LoginView formdata)
        {
            var user = await _userManager.FindByNameAsync(formdata.Username);

            if (user != null && await _userManager.CheckPasswordAsync(user, formdata.Password))
            {
                // Confirmation of email
                return Ok(new { username = user.UserName });
            }

            // Return error
            ModelState.AddModelError("", "Username/ Password was not found.");
            return Unauthorized(new { LoginError = "Please check the login credenticals - Invalid Username/ Password was entered. " });
        }
    }
}