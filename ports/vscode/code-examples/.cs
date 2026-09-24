using System;
using System.Collections.Generic;

namespace SyntaxTest
{
    public class ColorTester<T> where T : class
    {
        private readonly Dictionary<string, int> _cache = new();
        private const int MAX_ITEMS = 100;

        public event EventHandler<T> OnItemProcessed;

        public async Task<bool> ProcessItem(T item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));

            var result = await InternalProcess(item);

            #region Warning Generator
            int unused = 42; // This will generate a warning
            #endregion

            // This will generate an error - undefined variable
            Console.WriteLine(undefinedVariable);

            return result > MAX_ITEMS;
        }

        private async Task<int> InternalProcess(T item)
        {
            try
            {
                var hash = item.GetHashCode();
                _cache.Add(hash.ToString(), hash);
                OnItemProcessed?.Invoke(this, item);

                return await Task.FromResult(hash);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing item: {ex.Message}");
                return -1;
            }
        }
    }

    // Value types with different colors
    public enum ProcessingStatus
    {
        Pending,
        InProgress,
        Completed,
        Failed
    }
}
