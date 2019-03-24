import org.apache.jena.ontology.Individual;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.ontology.OntResource;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.util.FileManager;
import org.apache.jena.util.iterator.ExtendedIterator;

public class jena1 {


	 public static final String SOURCE_URL = "http://www.semanticweb.org/agerm/ontologies/2019/2/untitled-ontology-4";

	    protected static final String SOURCE_FILE = "../Datamining and Semantics Project/Datamini/project.owl";


	    public static final String NS = SOURCE_URL + "#";


	    public static void main( String[] args ) {
	    	System.out.println(SOURCE_URL);

			 org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.OFF);

	        new jena1().run();
	    }


	    public void run() {
	        OntModel m = ModelFactory.createOntologyModel( OntModelSpec.OWL_MEM );

	        load( m );

	    }


	    protected void load( OntModel m ) {
	        FileManager.get().getLocationMapper().addAltEntry( SOURCE_URL, SOURCE_FILE );
	        Model baseOntology = FileManager.get().loadModel( SOURCE_URL );
	        m.addSubModel( baseOntology );

	        ExtendedIterator<OntClass> classes = m.listClasses();
	        while (classes.hasNext())
	        {
	          OntClass thisClass = (OntClass) classes.next();

	          if (thisClass.toString().equals(NS + "persons")) {
		          ExtendedIterator<? extends OntResource> instances = thisClass.listInstances();
		          while (instances.hasNext())
		          {
		            Individual thisInstance = (Individual) instances.next();
		            System.out.println("  Found instance: " + thisInstance.toString());
		          }
	          }
	        }
	        

	}
}