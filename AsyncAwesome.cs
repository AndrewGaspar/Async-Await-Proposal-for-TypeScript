using System;
using System.Threading;
using System.Threading.Tasks;

namespace AsyncAwesome
{
    public class AsyncShowcase
    {
        public int Value { get; set; }

        public AsyncShowcase()
        {
            Value = 0;
        }

        public async Task addValue(int addVal) 
        {
            int newVal; // newVal can be assigned using either an awaited task or a synchronous operation
            if (addVal % 2 == 0)
            {
                newVal = await Task.Run(() => Value + addVal);
            }
            else
            {
                newVal = Value + addVal;
            }

            Value = newVal; // running this via a continuation or in line both work
        }

        public async Task addValuesInRange(int start, int range)
        {
            var endIndex = start + range;

            for (var i = start; i < endIndex; i++)
            {
                await this.addValue(i); // each addition is awaited before progressing to the next one
            }
        }

        public async Task<int> getValueAsync()
        {
            return await Task.Run(() => Value); // asynchronous getter
        }

        private async static Task AsyncMain()
        {
            var asyncShow = new AsyncShowcase();

            /*
             * A task can be started and not immediatley awaited.
             */
            var t = Task.Run(() =>
            {
                Thread.Sleep(1000);
                asyncShow.addValuesInRange(0, 10).Wait();
            });

            await asyncShow.addValue(10); // add 10 and wait

            Console.WriteLine(await asyncShow.getValueAsync()); // can wait within function call and function will receive argument

            await t;

            if (await asyncShow.getValueAsync() == 55) // I can use await within a conditional
            {
                Console.WriteLine("Success!");
            }
        }

        public static void Main()
        {
            AsyncShowcase.AsyncMain().Wait();
        }
    }
}