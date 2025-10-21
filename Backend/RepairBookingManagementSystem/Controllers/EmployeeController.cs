using System.Threading.Tasks;
using AutoMapper;
using RepairBookingManagementSystem.Dtos;
using RepairBookingManagementSystem.UoW;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace RepairBookingManagementSystem.Controllers
{
    [Route("api/v1/employees")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public EmployeeController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this._unitOfWork = unitOfWork;
            this._mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetEmployees([FromQuery] UserFilter filter)
        {
            var employeePage = await _unitOfWork.UserRepository.GetAllEmployees(filter);
            return Ok(new ApiResponse<PageResult<MyInfoResponse>> { Code = 1000, Result = _mapper.Map<PageResult<MyInfoResponse>>(employeePage) });
        }

        [HttpPost("account-action/{employeeId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> ActiveAccount([FromRoute] int employeeId, CancellationToken ct = default)
        {
            var employee = await _unitOfWork.UserRepository.FindByIdAsync(employeeId, ct);
            employee.Status = !employee.Status;
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000 });
        }
    }
}
