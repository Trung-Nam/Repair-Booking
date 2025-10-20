using HomeServiceManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeServiceManagementSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

 
        
        public DbSet<User> Users { get; set; }
        public DbSet<Service> Services {  get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<BlacklistToken> BlacklistTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .Property(user => user.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Booking>()
                .Property(booking => booking.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Booking>()
                .HasOne(booking => booking.Service)
                .WithMany(service => service.Bookings)
                .HasForeignKey(booking => booking.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
               .HasOne(booking => booking.Customer)
               .WithMany(customer => customer.CustomerBookings)
               .HasForeignKey(booking => booking.CustomerId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(booking => booking.Employee)
                .WithMany(employee => employee.EmployeeBookings)
                .HasForeignKey(booking => booking.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
