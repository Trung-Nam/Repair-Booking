using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using RepairBookingManagementSystem.Dtos;
using RepairBookingManagementSystem.Exceptions;
using RepairBookingManagementSystem.Models;
using RepairBookingManagementSystem.UoW;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace RepairBookingManagementSystem.Controllers
{
    [Route("api/v1/rating")]
    [ApiController]
    public class RatingController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IMapper _mapper;

        public RatingController(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> CreateRating([FromBody] RatingRequest request, CancellationToken ct = default) {

            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            var booking = await _unitOfWork.BookingRepository.FindByIdAsync(request.BookingId, ct);
            if (booking == null)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.BOOKING_NOT_FOUND, Message = ErrorCode.BOOKING_NOT_FOUND.Message() });
            }
            if (booking.Status != BookingStatus.COMPLETED)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.INVALID_BOOKING_STATUS, Message = ErrorCode.INVALID_BOOKING_STATUS.Message() });
            }
            if (booking.CustomerId != currentUser.Id) { 
                return Unauthorized();
            }
            
            // Ki?m tra xem dã dánh giá chua
            var existingRating = await _unitOfWork.RatingRepository.FindByBookingIdAsync(request.BookingId, ct);
            if (existingRating != null)
            {
                return Ok(new ApiResponse<string> { Code = 409, Message = "B?n dã dánh giá d?ch v? này r?i. M?i khách hàng ch? du?c dánh giá 1 l?n cho m?i d?ch v?." });
            }
            
            Rating rating = _mapper.Map<Rating>(request);
            rating.Booking = booking;
            rating.BookingId = booking.Id;
            _unitOfWork.RatingRepository.Add(rating);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Create Rating successfully" });
        }

        [HttpGet("check")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> CheckRating([FromQuery] int serviceId, [FromQuery] int customerId, CancellationToken ct = default)
        {
            try
            {
                // Tìm booking c?a customer cho service này
                var bookings = await _unitOfWork.BookingRepository.GetBookingsByServiceAndCustomerAsync(serviceId, customerId, ct);
                var completedBooking = bookings.FirstOrDefault(b => b.Status == BookingStatus.COMPLETED);
                
                if (completedBooking == null)
                {
                    return Ok(new ApiResponse<object> { Code = 1000, Result = new { hasRated = false } });
                }
                
                // Ki?m tra xem dã có rating chua
                var existingRating = await _unitOfWork.RatingRepository.FindByBookingIdAsync(completedBooking.Id, ct);
                bool hasRated = existingRating != null;
                
                return Ok(new ApiResponse<object> { Code = 1000, Result = new { hasRated = hasRated } });
            }
            catch (Exception ex)
            {
                return Ok(new ApiResponse<object> { Code = 500, Message = "L?i khi ki?m tra tr?ng thái dánh giá" });
            }
        }
    }
}
