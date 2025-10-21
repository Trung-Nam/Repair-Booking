using RepairBookingManagementSystem.Dtos;

namespace RepairBookingManagementSystem.Middleware
{
    public class GlobalExceptionMiddleware
    {

        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsJsonAsync(new ApiResponse<String> { Code = 9999, Message = ex.Message });
            }
        }

    }
}
