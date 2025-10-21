namespace RepairBookingManagementSystem.Dtos
{
    public class ServiceCreationRequest
    {
        public required string Name { get; set; }
        public required double Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public required string Category { get; set; }
    }

    public class ServiceUpdateRequest
    {
        public string? Name { get; set; }
        public string? ImageUrl { get; set; }
        public double? Price { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
    }

    public class ServiceResponse
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required double Price { get; set; }
        public string? ImageUrl { get; set; }
        public string? Description { get; set; }
        public required string Category { get; set; }
        public required double AverageRating { get; set; }
    }

    public class ServiceFilter
    {
        public string? Keyword { get; set; }
        public int? Field { get; set; }
        public double? FromPrice { get; set; }
        public double? ToPrice { get; set; }
        public required int PageNumber { get; set; }
        public required int PageSize { get; set; }
    }

    public class ServiceAverageRatingResponse
    {
        public required double AverageRating { get; set; }
    }
}
