import org.apache.jena.ontology.Individual;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.ontology.OntResource;
import org.apache.jena.query.Query;
import org.apache.jena.query.QueryExecution;
import org.apache.jena.query.QueryExecutionFactory;
import org.apache.jena.query.QueryFactory;
import org.apache.jena.query.QuerySolution;
import org.apache.jena.query.ResultSet;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.util.FileManager;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.apache.jena.rdf.model.Literal;

public class jena2 {


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
	        String queryString =
	        		"PREFIX vcard: <http://www.semanticweb.org/agerm/ontologies/2019/2/untitled-ontology-4#>"+
	        			"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>"+

	        			"SELECT ?name"+
	        			"WHERE"+
	        			  " { ?name rdf:type vcard:persons .}";
	        Query query = QueryFactory.create(queryString);
	        QueryExecution qexec = QueryExecutionFactory.create(query,baseOntology);
	        
	        try {
	        	ResultSet results =qexec.execSelect();
	        	while(results.hasNext()) {
	        		QuerySolution soln = results.nextSolution();
	        		Literal name = soln.getLiteral("x");
	        		System.out.println(name);
	        	}
	        }finally {
	        	qexec.close();
	        }
	        

	}
}