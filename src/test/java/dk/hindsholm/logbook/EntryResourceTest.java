package dk.hindsholm.logbook;

import java.net.URI;
import javax.ws.rs.core.UriBuilder;
import javax.ws.rs.core.UriInfo;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class EntryResourceTest {

    @Mock
    private UriInfo ui;

    @InjectMocks
    private EntryResource resource;

    @Test
    public void testGet() throws Exception {
        when(ui.getAbsolutePathBuilder()).thenReturn(UriBuilder.fromUri("http://test/entries/someId"));
        Entry entry = resource.getEntry("someId");
        assertEquals("someId", entry.getId());
        assertEquals(new URI("http://test/entries/someId"), entry.getLink());
    }

}
