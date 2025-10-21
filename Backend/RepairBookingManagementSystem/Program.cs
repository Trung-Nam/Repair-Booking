using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using RepairBookingManagementSystem.Configurations;
using RepairBookingManagementSystem.Data;
using RepairBookingManagementSystem.Middleware;
using RepairBookingManagementSystem.Models;
using RepairBookingManagementSystem.Repositories;
using RepairBookingManagementSystem.UoW;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Fill 'Bearer {token}' to authenticate"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is not configured.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(option =>
    {
        option.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidateAudience = false,
            RoleClaimType = ClaimTypes.Role,
            ValidIssuer = "hms.com.vn",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
        option.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                var jti = context.Principal!.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;

                if (jti != null)
                {
                    var isBlacklisted = await db.BlacklistTokens
                        .AnyAsync(b => b.Jti == jti);

                    if (isBlacklisted)
                    {
                        context.Fail("This token has been revoked.");
                    }
                }
            }
        };
    });
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
var  MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                      });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IBlacklistTokenRepository, BlacklistTokenRepository>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserRepository,  UserRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IRatingRepository, RatingRepository>();

var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    dbContext.Database.Migrate();
    var user = dbContext.Users.Where(u => u.Email == "admin@gmail.com").FirstOrDefault();
    if (user == null)
    {
        var admin = new User
        {
            Fullname = "Admin",
            Email = "admin@gmail.com",
            Password = BCrypt.Net.BCrypt.HashPassword("123456"),
            PhoneNumber = "0123456789",
            Status = true,
            Role = Role.ADMIN
        };

        dbContext.Users.Add(admin);
        dbContext.SaveChanges();
        Console.WriteLine("Seeded admin user successfully");
    }

    user = dbContext.Users.Where(u => u.Email == "customer@gmail.com").FirstOrDefault();
    if (user == null)
    {
        var customer = new User
        {
            Fullname = "Customer",
            Email = "customer@gmail.com",
            Password = BCrypt.Net.BCrypt.HashPassword("123456"),
            PhoneNumber = "0123456789",
            Status = true,
            Role = Role.CUSTOMER
        };

        dbContext.Users.Add(customer);
        dbContext.SaveChanges();
        Console.WriteLine("Seeded customer user successfully");
    }

    user = dbContext.Users.Where(u => u.Email == "employee@gmail.com").FirstOrDefault();
    if (user == null)
    {
        var employee = new User
        {
            Fullname = "Employee",
            Email = "employee@gmail.com",
            Password = BCrypt.Net.BCrypt.HashPassword("123456"),
            PhoneNumber = "0123456789",
            Status = true,
            Role = Role.EMPLOYEE
        };

        dbContext.Users.Add(employee);
        dbContext.SaveChanges();
        Console.WriteLine("Seeded employee user successfully");
    }

}

app.Run();
