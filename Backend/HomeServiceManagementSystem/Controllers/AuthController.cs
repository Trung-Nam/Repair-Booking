using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using HomeServiceManagementSystem.Configurations;
using HomeServiceManagementSystem.Dtos;
using HomeServiceManagementSystem.Exceptions;
using HomeServiceManagementSystem.Models;
using HomeServiceManagementSystem.UoW;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using LoginRequest = HomeServiceManagementSystem.Dtos.LoginRequest;
using RegisterRequest = HomeServiceManagementSystem.Dtos.RegisterRequest;

namespace HomeServiceManagementSystem.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly JwtSettings _jwtSettings;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _contextAccessor;

        public AuthController(IUnitOfWork unitOfWork, IMapper mapper, IOptions<JwtSettings> jwtOptions, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _jwtSettings = jwtOptions.Value;
            _contextAccessor = contextAccessor;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var existingEmail = await _unitOfWork.UserRepository.FindByEmailAsync(request.Email);
            if(existingEmail != null)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.EMAIL_EXISTED, Message = ErrorCode.EMAIL_EXISTED.Message() }); 
            }
            var existingPhoneNumber = await _unitOfWork.UserRepository.FindByPhoneNumberAsync(request.PhoneNumber);
            if (existingPhoneNumber != null) {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.PHONE_NUMBER_EXISTED, Message = ErrorCode.PHONE_NUMBER_EXISTED.Message()});
            }
            User user = _mapper.Map<User>(request);
            user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            user.Status = true;
            _unitOfWork.UserRepository.Add(user);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Register successfully" });
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request) {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            var existingEmail = await _unitOfWork.UserRepository.FindByEmailAsync(request.Email!);
            if(existingEmail != null && existingEmail.Id != currentUser.Id) {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.EMAIL_EXISTED, Message = ErrorCode.EMAIL_EXISTED.Message() });
            }
            var existingPhoneNumber = await _unitOfWork.UserRepository.FindByPhoneNumberAsync(request.PhoneNumber!);
            if(existingPhoneNumber != null && existingPhoneNumber.Id != currentUser.Id)
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.PHONE_NUMBER_EXISTED, Message = ErrorCode.PHONE_NUMBER_EXISTED.Message() });
            }
            if (request.Fullname != null) currentUser.Fullname = request.Fullname;
            if (request.Email != null) currentUser.Email = request.Email;
            if (request.PhoneNumber != null) currentUser.PhoneNumber = request.PhoneNumber;
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Update Profile Successfully" });

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request, CancellationToken ct)
        {
            var user = await _unitOfWork.UserRepository.FindAsync(u =>
                u.Email == request.Email, ct);
            if (!user.Any())
            {
                return Ok(new ApiResponse<string> { Code = (int) ErrorCode.INVALID_CREDENTIAL, Message = ErrorCode.INVALID_CREDENTIAL.Message() });
            }
            var foundUser = user.FirstOrDefault();
            var verifyResult = BCrypt.Net.BCrypt.Verify(request.Password, foundUser!.Password);

            if (!verifyResult)
            {
                return Ok(new ApiResponse<string> { Code = (int) ErrorCode.INVALID_CREDENTIAL, Message = ErrorCode.INVALID_CREDENTIAL.Message() });
            }

            if(foundUser!.Status == false)
            {
                return Ok(new ApiResponse<string> { Code = (int) ErrorCode.ACCOUNT_NOT_ACTIVE, Message = ErrorCode.ACCOUNT_NOT_ACTIVE.Message() });
            }
            return Ok(new ApiResponse<LoginResponse> { Code = 1000, Result = new LoginResponse { Token = GenerateToken(foundUser), Role = foundUser.Role.ToString() } });

        }

        [HttpPost("logout")]
         public async Task<IActionResult> Logout(string token, CancellationToken ct)
         {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            var jti = jwt.Claims.First(c => c.Type == JwtRegisteredClaimNames.Jti).Value;
            var expiry = jwt.ValidTo;
            _unitOfWork.BlacklistTokenRepository.Add(new BlacklistToken()
            {
                Jti = jti,
                ExpiryDate = expiry
            });
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Logout successfully" });
         }

        [Authorize()]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            if(!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, currentUser.Password))
            {
                return Ok(new ApiResponse<string> { Code = (int)ErrorCode.INVALID_CREDENTIAL, Message = ErrorCode.INVALID_CREDENTIAL.Message()});
            }
            currentUser.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new ApiResponse<string> { Code = 1000, Result = "Change password successfully"});
        }

        [Authorize()]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyInfo()
        {
            string? email = _contextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var currentUser = await _unitOfWork.UserRepository.FindByEmailAsync(email!);
            return Ok(new ApiResponse<MyInfoResponse> { Code = 1000, Result = _mapper.Map<MyInfoResponse>(currentUser) });
        }

        [Authorize()]
        [HttpGet]
        public IActionResult HelloWorld()
        {
            return Ok("Hello World");
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                    issuer: _jwtSettings.Issuer,
                    claims: claims,
                    expires: DateTime.Now.AddHours(3),
                    signingCredentials: creds
                );
            return new JwtSecurityTokenHandler().WriteToken(token);

        }

    }
}
