package dk.hindsholm.logbook;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.ext.Provider;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.jaxrs.cfg.Annotations;
import com.fasterxml.jackson.jaxrs.json.JacksonJaxbJsonProvider;

/**
 * JAX-RS application setting up Jackson as JSON provider.
 */
@ApplicationPath("/")
public class ServicesApplication extends Application {
    
    private final Set<Object> singletons = new HashSet<>();

    public ServicesApplication() {
        singletons.add(createJsonProvider());
    }

    @Override
    public Set<Class<?>> getClasses() {
        return new HashSet<>(Arrays.asList(EchoService.class, EntryResource.class));
    }

    @Override
    public Set<Object> getSingletons() {
        return Collections.unmodifiableSet(singletons);
    }

    private JacksonJaxbJsonProvider createJsonProvider() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_EMPTY);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_DEFAULT);
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return new CustomJaxbJsonProvider(mapper, JacksonJaxbJsonProvider.DEFAULT_ANNOTATIONS);
    }

    /**
     * Specialization to ensure specific consumes and produces annotations since wildcard annotations has some
     * problems with RESTeasy.
     */
    @Provider
    @Consumes({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML, MediaType.TEXT_XML })
    @Produces({MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML, MediaType.TEXT_XML })
    private static class CustomJaxbJsonProvider extends JacksonJaxbJsonProvider {
        public CustomJaxbJsonProvider(ObjectMapper mapper, Annotations[] annotationsToUse) {
            super(mapper, annotationsToUse);
        }
    }

}
