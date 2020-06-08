using Microsoft.AspNetCore.Mvc;
using MP.Database;
using System.Linq;

namespace Manage_Product.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _db; 
        
        public ProductController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/value
        [HttpGet("[action]")]
        public IActionResult GetProducts()
        {
            return Ok(_db.Products.ToList());
        }
    }
}