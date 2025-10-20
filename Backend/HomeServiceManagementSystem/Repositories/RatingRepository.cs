using System.Threading.Tasks;
using HomeServiceManagementSystem.Data;
using HomeServiceManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeServiceManagementSystem.Repositories
{

    public interface IRatingRepository: IRepository<Rating> { 
        
        Task<double> GetAverageRatingByServiceId(int  serviceId, CancellationToken ct = default);
        Task<Rating?> FindByBookingIdAsync(int bookingId, CancellationToken ct = default);

    }
    public class RatingRepository : Repository<Rating>, IRatingRepository
    {
        public RatingRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<double> GetAverageRatingByServiceId(int serviceId, CancellationToken ct = default)
        {
            var query = _dbSet
                        .Where(r => r.Booking.ServiceId == serviceId)
                        .Select(r => (double?)r.Rate); 
            double average = await query.AverageAsync() ?? 0.0; 
            return average;
        }

        public async Task<Rating?> FindByBookingIdAsync(int bookingId, CancellationToken ct = default)
        {
            return await _dbSet
                .Include(r => r.Booking)
                .FirstOrDefaultAsync(r => r.BookingId == bookingId, ct);
        }
    }
}
