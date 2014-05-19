package dk.hindsholm.logbook;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;
 
@Path("/echo")
public class EchoService {
 
	@GET
	@Path("/{param}")
	public Response getMsg(@PathParam("param") String msg) {
		String output = "Echo: " + msg;
		return Response.status(200).entity(output).build();
 
	}
 
}
