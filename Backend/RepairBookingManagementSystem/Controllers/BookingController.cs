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
    [Route("api/v1/bookings")]
    [ApiController]
    public class BookingController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IMapper _mapper;

        public BookingController(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> OrderBooking([FromBody] BookingOrderRequest request, CancellationToken ct = default)
        {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            var service = await _unitOfWork.ServiceRepository.FindByIdAsync(request.ServiceId, ct);
            if (service == null) {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.SERVICE_NOT_FOUND, Message = ErrorCode.SERVICE_NOT_FOUND.Message() });
            }
            Booking booking = new Booking
            {
                Service = service,
                ServiceId = request.ServiceId,
                Customer = currentUser,
                Address = request.Address,
                HireAt = request.HireAt,
                Note = request.Note,
                CustomerId = currentUser.Id,
                Status = BookingStatus.PENDING,
                Employee = null,
            };
            _unitOfWork.BookingRepository.Add(booking);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Order booking successfully" }); 
        }

        [HttpPatch("{bookingId}/accept")]
        [Authorize(Roles = "EMPLOYEE")]
        public async Task<IActionResult> AcceptBooking([FromRoute] int bookingId, CancellationToken ct = default)
        {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            var booking = await _unitOfWork.BookingRepository.FindByIdAsync(bookingId, ct);
            if (currentUser!.Status == false)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.ACCOUNT_NOT_ACTIVE, Message = ErrorCode.ACCOUNT_NOT_ACTIVE.Message() });
            }
            if (booking == null) {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.BOOKING_NOT_FOUND, Message = ErrorCode.BOOKING_NOT_FOUND.Message() });
            }
            if (booking.Status != BookingStatus.PENDING) {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.INVALID_BOOKING_STATUS, Message = ErrorCode.INVALID_BOOKING_STATUS.Message() });
            }
            booking.Employee = currentUser;
            booking.EmployeeId = currentUser.Id;
            booking.Status = BookingStatus.ACCEPTED;
            await _unitOfWork.SaveChangesAsync(ct);
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Accept Booking successfully" });
            
        }

        [HttpPatch("{bookingId}/finish")]
        [Authorize(Roles = "EMPLOYEE")]
        public async Task<IActionResult> FinishBooking([FromRoute] int bookingId, CancellationToken ct = default)
        {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            Booking booking = await _unitOfWork.BookingRepository.FindByIdAsync(bookingId, ct);
            if (currentUser!.Status == false)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.ACCOUNT_NOT_ACTIVE, Message = ErrorCode.ACCOUNT_NOT_ACTIVE.Message() });
            }
            if (booking == null) {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.BOOKING_NOT_FOUND, Message = ErrorCode.BOOKING_NOT_FOUND.Message() });
            }
            if(booking.EmployeeId != currentUser.Id)
            {
                return Unauthorized();
            }
            if (booking.Status != BookingStatus.ACCEPTED)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.INVALID_BOOKING_STATUS, Message = ErrorCode.INVALID_BOOKING_STATUS.Message() });
            }
            booking.Status = BookingStatus.COMPLETED;
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Finish Booking successfully" });
        }

        [HttpPatch("{bookingId}/cancel")]
        [Authorize(Roles = "CUSTOMER")]
        public async Task<IActionResult> CancelBooking([FromRoute] int bookingId, CancellationToken ct = default)
        {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            var booking = await _unitOfWork.BookingRepository.FindByIdAsync(bookingId, ct);
            
            if (booking == null)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.BOOKING_NOT_FOUND, Message = ErrorCode.BOOKING_NOT_FOUND.Message() });
            }
            
            // Ki?m tra quy?n s? h?u - ch? customer s? h?u booking m?i du?c h?y
            if (booking.CustomerId != currentUser.Id)
            {
                return Unauthorized();
            }
            
            // Ch? cho ph�p h?y booking ? tr?ng th�i PENDING
            if (booking.Status != BookingStatus.PENDING)
            {
                return Ok(new ApiResponse<string> { 
                    Code = 400, 
                    Message = "Ch? c� th? h?y don d?t d?ch v? dang ch? x? l�. �on d?t d� du?c ch?p nh?n ho?c ho�n th�nh kh�ng th? h?y." 
                });
            }
            
            // C?p nh?t tr?ng th�i booking th�nh CANCELLED
            booking.Status = BookingStatus.CANCELLED;
            await _unitOfWork.SaveChangesAsync();
            
            return Ok(new ApiResponse<string> { Code = 1000, Result = "H?y don d?t d?ch v? th�nh c�ng" });
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetBookings([FromQuery] BookingFilter bookingFilter)
        {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            var bookingPage = await _unitOfWork.BookingRepository.GetAllBookingsAsync(bookingFilter);

            var filteredBookings = bookingPage.Items.Where(b =>
                currentUser.Role == Role.ADMIN ||
                (currentUser.Role == Role.CUSTOMER && b.CustomerId == currentUser.Id) ||
                (currentUser.Role == Role.EMPLOYEE && (b.EmployeeId == currentUser.Id || b.Status == BookingStatus.PENDING))
            );

            var bookingResponses = new List<BookingResponse>();
            
            foreach (var b in filteredBookings)
            {
                bool hasRated = false;
                
                // Ch? ki?m tra rating cho booking d� ho�n th�nh
                if (b.Status == BookingStatus.COMPLETED)
                {
                    var existingRating = await _unitOfWork.RatingRepository.FindByBookingIdAsync(b.Id);
                    hasRated = existingRating != null;
                }
                
                bookingResponses.Add(new BookingResponse
                {
                    Id = b.Id,
                    CustomerId = b.CustomerId,
                    CustomerName = b.Customer!.Fullname,
                    ServiceName = b.Service!.Name,
                    EmployeeId = b.EmployeeId,
                    EmployeeName = b.Employee?.Fullname,
                    Address = b.Address,
                    HireAt = b.HireAt,
                    Note = b.Note,
                    Price = b.Service.Price,
                    Status = b.Status,
                    HasRated = hasRated
                });
            }

            var response = new PageResult<BookingResponse>
            {
                Items = bookingResponses,
                Page = bookingFilter.PageNumber,
                PageSize = bookingFilter.PageSize,
                TotalItems = bookingResponses.Count(),
            };

            return Ok(new ApiResponse<PageResult<BookingResponse>> { Code = 1000, Result = response });
        }

    }
}
