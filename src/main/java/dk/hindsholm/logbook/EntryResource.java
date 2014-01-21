package dk.hindsholm.logbook;

import java.net.URI;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

@Path("/entries")
public class EntryResource {

    @Context
    private UriInfo uriInfo;

    @GET
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Path("/{id}")
    public Entry getEntry(@PathParam("id") String id) {
        URI uri = uriInfo.getAbsolutePathBuilder().build();
        return new Entry(id, uri);
    }

}
