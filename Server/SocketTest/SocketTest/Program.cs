using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace SocketTest
{
    class Program
    {

        static bool run = true;
        static void Main(string[] args)
        {
            Console.WriteLine("Server");
            Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            socket.Bind(new IPEndPoint(IPAddress.Parse("127.0.0.1"), 6000));
            socket.Listen(20);
            socket.BeginAccept(AcceptMethod, socket);

            while(run)
            {
                
            }
        }

        private static void AcceptMethod(IAsyncResult ar)
        {
            Socket lSocket = (Socket)ar.AsyncState;
            Socket cSocket = null;

            try
            {
                cSocket = lSocket.EndAccept(ar);

                byte[] buffer = new byte[cSocket.ReceiveBufferSize];
                int actualReceived = cSocket.Receive(buffer, 0, cSocket.ReceiveBufferSize, SocketFlags.None);

                string receive = "";

                using (MemoryStream mStream = new MemoryStream(buffer, 0, actualReceived))
                {
                    using (BinaryReader reader = new BinaryReader(mStream))
                    {
                        receive = reader.ReadString();
                    }
                }

                Console.WriteLine("Received: " + receive);
                Thread.Sleep(100);
                byte[] sending;
                using (MemoryStream mStream = new MemoryStream())
                {
                    using (BinaryWriter writer = new BinaryWriter(mStream))
                    {
                        writer.Write("Sending: " + receive);
                    }
                    sending = mStream.ToArray();
                }

                cSocket.Send(sending);
                Console.WriteLine("Sent: " + receive);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            //System.Threading.Thread.Sleep(50);
            //cSocket.Shutdown(SocketShutdown.Both);
            cSocket.Close();
            lSocket.BeginAccept(AcceptMethod, lSocket);
        }
    }
}
