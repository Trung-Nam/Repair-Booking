namespace RepairBookingManagementSystem.Models
{
    public class BlacklistToken
    {
        public int Id { get; set; }
        public string Jti { get; set; } = null!;
        public DateTime ExpiryDate { get; set; }
    }
}
