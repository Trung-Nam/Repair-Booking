using HomeServiceManagementSystem.Data;
using HomeServiceManagementSystem.Dtos;
using HomeServiceManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeServiceManagementSystem.Repositories
{

    public interface IBookingRepository: IRepository<Booking> { 
        Task<PageResult<Booking>> GetAllBookingsAsync(BookingFilter filter, CancellationToken ct = default);
        Task<List<Booking>> GetBookingsByServiceAndCustomerAsync(int serviceId, int customerId, CancellationToken ct = default);
    }
    public class BookingRepository : Repository<Booking>, IBookingRepository
    {
        public BookingRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<PageResult<Booking>> GetAllBookingsAsync(BookingFilter filter, CancellationToken ct = default)
        {
            var query = _dbSet.AsNoTracking()
                .Include(b => b.Service)
                .Include(b => b.Customer)
                .Include(b => b.Employee)
                .AsQueryable();
            if (filter.Keyword != null)
            {
                if (filter.Field == 1)
                {
                    query = query.Where(b => b.Service!.Name.Contains(filter.Keyword));
                }
                else if (filter.Field == 2)
                {
                    query = query.Where(b => b.Customer!.Fullname.Contains(filter.Keyword));
                }
                else if (filter.Field == 3)
                {
                    query = query.Where(b => b.Employee!.Fullname.Contains(filter.Keyword));
                }
            }
            int totalItems = await query.CountAsync(ct);
            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync(ct);
            return new PageResult<Booking> { PageSize = filter.PageSize, Items = items, Page = filter.PageNumber, TotalItems = totalItems };
        }

        public async Task<List<Booking>> GetBookingsByServiceAndCustomerAsync(int serviceId, int customerId, CancellationToken ct = default)
        {
            return await _dbSet
                .Include(b => b.Service)
                .Include(b => b.Customer)
                .Include(b => b.Employee)
                .Where(b => b.ServiceId == serviceId && b.CustomerId == customerId)
                .ToListAsync(ct);
        }
    }
}
