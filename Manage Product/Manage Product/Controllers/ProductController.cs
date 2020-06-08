using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MP.Database;
using MP.Domain.Models;
using System.Linq;
using System.Threading.Tasks;

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

        // POST: api/value
        [HttpPost("[action]")]
        public async Task<IActionResult> AddProduct([FromBody] Product formdata)
        {
            var newProduct = new Product
            {
                Name = formdata.Name,
                ImageUrl = formdata.ImageUrl,
                Description = formdata.Description,
                OutOfStock = formdata.OutOfStock,
                Price = formdata.Price
            };
            await _db.Products.AddAsync(newProduct);
            await _db.SaveChangesAsync();
            return Ok();
        }

        // POST: api/product/1
        [HttpPost("[action]")]
        public async Task<IActionResult> UpdateProduct([FromRoute] int id, [FromBody] Product formdata)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var findProduct = _db.Products.FirstOrDefault(p => p.ProductId == id);
            if (findProduct == null)
            {
                return NotFound();
            }

            // If the product was found
            findProduct.Name = formdata.Name;
            findProduct.Description = formdata.Description;
            findProduct.ImageUrl = formdata.ImageUrl;
            findProduct.OutOfStock = formdata.OutOfStock;
            findProduct.Price = formdata.Price;

            _db.Entry(findProduct).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return Ok(new JsonResult("The Product with ID" + id + " is updated"));
        }

        [HttpDelete("[action]")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the product
            var findProduct = await _db.Products.FindAsync(id);
            if (findProduct == null)
            {
                return NotFound();
            }
            _db.Products.Remove(findProduct);
            await _db.SaveChangesAsync();

            // Finally return 
            return Ok(new JsonResult("The Product with ID" + id + " is deleted."));
        }
    }
}