using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SocketClient
{
    class Program
    {
        static volatile int num = 0;
        static void Main(string[] args)
        {
            
            Console.WriteLine("Client");
            bool run = true;
            while(run)
            {
                ConsoleKeyInfo key = Console.ReadKey();
                if(key.Key == ConsoleKey.Escape)
                {
                    run = false;
                    break;
                }
                if(key.Key ==  ConsoleKey.M)
                {
                    Task.Run(new Action(SendAndReceive));
                    Task.Run(new Action(SendAndReceive));
                }
                else
                {
                    SendAndReceive();
                }
                
            }
        }

        static void SendAndReceive()
        {

            Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);

            lock (socket)
            {
                try
                {
                    byte[] sending;
                    using (MemoryStream mStream = new MemoryStream())
                    {
                        using (BinaryWriter writer = new BinaryWriter(mStream))
                        {
                            num++;
                            writer.Write(num.ToString());
                        }
                        sending = mStream.ToArray();
                    }

                    Console.WriteLine("Sent: " + num.ToString());

                    // Open the connection.
                    socket.Connect(IPAddress.Parse("127.0.0.1"),
                        6000);
                    socket.Send(sending);

                    byte[] buffer = new byte[socket.ReceiveBufferSize];
                    int actualReceived = socket.Receive(buffer, 0, socket.ReceiveBufferSize, SocketFlags.None);

                    if (actualReceived == 0)
                    {
                        throw new Exception("No Response Received");
                    }

                    // Read the interface Message we received
                    string receive = "";

                    using (MemoryStream mStream = new MemoryStream(buffer, 0, actualReceived))
                    {
                        using (BinaryReader reader = new BinaryReader(mStream))
                        {
                            receive = reader.ReadString();
                        }
                    }

                    Console.WriteLine("Received: " + receive);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);

                }
                finally
                {
                    socket.Shutdown(SocketShutdown.Both);
                    socket.Close();

                }
            }
        }
    }
}
