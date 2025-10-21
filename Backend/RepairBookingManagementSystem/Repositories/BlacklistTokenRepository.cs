using RepairBookingManagementSystem.Data;
using RepairBookingManagementSystem.Models;

namespace RepairBookingManagementSystem.Repositories
{

    public interface IBlacklistTokenRepository : IRepository<BlacklistToken>{
    }

    public class BlacklistTokenRepository : Repository<BlacklistToken>, IBlacklistTokenRepository
    {
        public BlacklistTokenRepository(AppDbContext context) : base(context){
        }

    }

}
