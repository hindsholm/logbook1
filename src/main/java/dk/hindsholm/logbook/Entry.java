package dk.hindsholm.logbook;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.net.URI;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * An individual logbook entry.
 */
@XmlRootElement
public class Entry {

    private String id;
    private URI link;
    private String description;

    public Entry() {
        // used by Jackson
    }

    public Entry(@JsonProperty("id") String id, @JsonProperty("link") URI link, @JsonProperty("description") String description) {
        this.id = id;
        this.link = link;
        this.description = description;
    }

    @XmlElement
    public String getId() {
        return id;
    }

    @XmlElement
    public String getDescription() {
        return description;
    }

    @XmlElement
    public URI getLink() {
        return link;
    }
}
