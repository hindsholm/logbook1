package dk.hindsholm.logbook;

import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.test.framework.JerseyTest;
import com.sun.jersey.test.framework.WebAppDescriptor;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class EntryServiceTest extends JerseyTest {

    public EntryServiceTest() throws Exception {
        super(new WebAppDescriptor.Builder("dk.hindsholm.logbook").build());
    }

    @Test
    public void testGetEntry() throws Exception {
        WebResource webResource = resource();
        Entry response = webResource.path("entries/myId").get(Entry.class);
        assertEquals("myId", response.getId());
        assertEquals(getBaseURI().resolve("entries/myId"), response.getLink());
    }

}
