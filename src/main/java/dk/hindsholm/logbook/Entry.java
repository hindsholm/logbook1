package dk.hindsholm.logbook;

import java.net.URI;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

/**
 * An individual logbook entry.
 */
@XmlRootElement(name = "entry")
public class Entry {
    
    private String id;
    private URI link;

    public Entry() {
        // used by JAXB
    }

    public Entry(String id, URI link) {
        this.id = id;
        this.link = link;
    }

    @XmlElement
    public String getId() {
        return id;
    }

    @XmlElement
    public String getDescription() {
        return "no description available";
    }

    @XmlElement
    public URI getLink() {
        return link;
    }
}
