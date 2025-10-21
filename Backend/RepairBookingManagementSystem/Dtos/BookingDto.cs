using RepairBookingManagementSystem.Models;

namespace RepairBookingManagementSystem.Dtos
{
    public class BookingOrderRequest
    {

        public required int ServiceId { get; set; }
        public required DateTime HireAt { get; set; }
        public required string Address { get; set; }
        public string? Note { get; set; }

    }

    public class BookingResponse
    {
        public int Id { get; set; }
        public required string ServiceName {  get; set; }
        public required string CustomerName {  get; set; }
        public required int CustomerId { get; set; }
        public required DateTime HireAt { get; set; }
        public required string Address { get; set; }
        public string? Note { get; set; }
        public string? EmployeeName { get; set;}
        public int? EmployeeId { get; set; }
        public double Price { get; set; }
        public required BookingStatus Status { get; set; }
        public bool HasRated { get; set; } = false;
    }
    
    public class BookingFilter
    {
        public string? Keyword { get; set; }
        public int? Field {  get; set; }
        public required int PageNumber { get; set; }
        public required int PageSize { get; set; }
    }
}
