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
    [Route("api/v1/services")]
    [ApiController]
    public class ServiceController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ServiceController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateService(ServiceCreationRequest request)
        {
            if(request.Price < 0)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.PRICE_INVALID, Message = ErrorCode.PRICE_INVALID.Message() });
            }
            Service service = _mapper.Map<Service>(request);
            _unitOfWork.ServiceRepository.Add(service);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Create Service successfully" });
        }

        [HttpPut("{serviceId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateService([FromRoute] int serviceId, [FromBody] ServiceUpdateRequest request, CancellationToken ct = default) {
            if (request.Price != null && request.Price < 0)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.PRICE_INVALID, Message = ErrorCode.PRICE_INVALID.Message() });
            }
            Service service = await _unitOfWork.ServiceRepository.FindByIdAsync(serviceId, ct);
            if (service == null) { 
                return Ok(new ApiResponse<string> { Code = (int) ErrorCode.SERVICE_NOT_FOUND, Message = ErrorCode.SERVICE_NOT_FOUND.Message() });
            }
            if(request.Price == null)
            {
                request.Price = service.Price;
            }
            _mapper.Map(request, service);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = $"Update Service {service.Name} successfully" });
        }

        [HttpDelete("{serviceId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteService([FromRoute] int serviceId, CancellationToken ct = default) {
            await _unitOfWork.ServiceRepository.DeleteByIdAsync(serviceId, ct);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Delete Service successfully" });
        }

        [HttpGet]
        public async Task<IActionResult> GetServices([FromQuery] ServiceFilter filter)
        {
            var services = await _unitOfWork.ServiceRepository.GetServicesAsync(filter);
            var response = _mapper.Map<PageResult<ServiceResponse>>(services);
            foreach (var service in response.Items) {
                service.AverageRating = await _unitOfWork.RatingRepository.GetAverageRatingByServiceId(service.Id);
            }
            return Ok(new ApiResponse<PageResult<ServiceResponse>> { Code = 1000, Result = response});
        }

        [HttpGet("{serviceId}")]
        public async Task<IActionResult> GetServiceById([FromRoute] int serviceId, CancellationToken ct = default)
        {
            var service = await _unitOfWork.ServiceRepository.FindByIdAsync(serviceId, ct);
            return Ok(new ApiResponse<ServiceResponse> { Code = 1000, Result =  _mapper.Map<ServiceResponse>(service)}); 
        }

        [HttpGet("{serviceId}/rating")]
        public async Task<IActionResult> GetServiceAverageRating([FromRoute] int serviceId, CancellationToken ct = default)
        {
            var service = await _unitOfWork.ServiceRepository.FindByIdAsync(serviceId, ct);
            if (service == null)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.SERVICE_NOT_FOUND, Message = ErrorCode.SERVICE_NOT_FOUND.Message() });
            }
            ServiceAverageRatingResponse response = new ServiceAverageRatingResponse
            { AverageRating = await _unitOfWork.RatingRepository.GetAverageRatingByServiceId(serviceId) };
            return Ok(new ApiResponse<ServiceAverageRatingResponse> { Code = 1000, Result = response });
        }
    }
}
