package dk.hindsholm.logbook;

import static junit.framework.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import com.google.appengine.tools.development.testing.LocalUserServiceTestConfig;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloServletTest {

    private HelloServlet guestbookServlet;

    private final LocalServiceTestHelper helper
            = new LocalServiceTestHelper(new LocalUserServiceTestConfig())
            .setEnvIsLoggedIn(true)
            .setEnvAuthDomain("localhost")
            .setEnvEmail("test@localhost");

    @Before
    public void setupGuestBookServlet() {
        helper.setUp();
        guestbookServlet = new HelloServlet();
    }

    @After
    public void tearDownHelper() {
        helper.tearDown();
    }

    @Test
    public void testDoGet() throws IOException {
        HttpServletRequest request = mock(HttpServletRequest.class);
        when(request.getContextPath()).thenReturn("/hello");

        HttpServletResponse response = mock(HttpServletResponse.class);

        StringWriter stringWriter = new StringWriter();
        when(response.getWriter()).thenReturn(new PrintWriter(stringWriter));

        guestbookServlet.doGet(request, response);
        assertTrue(stringWriter.toString().contains("Servlet HelloServlet"));
    }

}
