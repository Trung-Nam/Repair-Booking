namespace HomeServiceManagementSystem.Dtos
{
    public class ApiResponse<T>
    {
        public required int Code { get; set; }
        public T? Result { get; set; }
        public string? Message { get; set; }

    }
}
