using HomeServiceManagementSystem.Data;
using HomeServiceManagementSystem.Repositories;

namespace HomeServiceManagementSystem.UoW
{

    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IBlacklistTokenRepository BlacklistTokenRepository { get; }
        IServiceRepository ServiceRepository { get; }
        IBookingRepository BookingRepository { get; }
        IRatingRepository RatingRepository { get; }
        Task SaveChangesAsync(CancellationToken ct = default);
        void SaveChanges();
    }

    public class UnitOfWork: IUnitOfWork
    {

        private readonly AppDbContext _dbContext;
        
        public IUserRepository UserRepository { get; }
        public IServiceRepository ServiceRepository { get; }
        public IBlacklistTokenRepository BlacklistTokenRepository { get; }
        public IBookingRepository BookingRepository { get; }
        public IRatingRepository RatingRepository { get; }

        public UnitOfWork(AppDbContext dbContext, IUserRepository userRepository, IBlacklistTokenRepository blacklistTokenRepository, IServiceRepository serviceRepository, IBookingRepository bookingRepository, IRatingRepository ratingRepository)
        {
            _dbContext = dbContext;
            UserRepository = userRepository;
            this.ServiceRepository = serviceRepository;
            this.BlacklistTokenRepository = blacklistTokenRepository;
            BookingRepository = bookingRepository;
            RatingRepository = ratingRepository;
        }

        void IUnitOfWork.SaveChanges()
        {
            _dbContext.SaveChanges();
        }

        async Task IUnitOfWork.SaveChangesAsync(CancellationToken ct)
        {
            await _dbContext.SaveChangesAsync(ct);
        }

    }

}
