using System.ComponentModel.DataAnnotations;

namespace HomeServiceManagementSystem.Dtos
{
    public class RatingRequest
    {
        public required int BookingId { get; set; }
        [Range(1, 5)]
        public required int Rate { get; set; }
        public string? Comment { get; set; }
    }
}
