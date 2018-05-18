package db.mongodb;

import java.util.ArrayList;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List; 
import java.util.Set;

import javax.swing.event.ListSelectionEvent;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Date;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.util.JSON;

import static com.mongodb.client.model.Filters.eq;


public class MongoDBConnection { 
	private MongoClient mongoClient;
	private MongoDatabase db;
	
	public MongoDBConnection() {
		// MongoDB Java Driver help manage a pool of connections
		mongoClient = new MongoClient(new MongoClientURI(MongoDBUtil.URL));
		db = mongoClient.getDatabase(MongoDBUtil.DB_NAME);
	}
	
	public void close() {
		if (mongoClient != null) {
			mongoClient.close();
		}
	}
	
	public Date getLatestTime() {
		MongoCollection<Document> c = db.getCollection("trends");
		AggregateIterable<Document> output = c.aggregate(Arrays.asList(
		        new Document("$project", new Document("crawled_time", 1)),
		        new Document("$group", new Document("_id", "$crawled_time")
		        					.append("t", new Document("$first", "$crawled_time"))),
		        new Document("$sort", new Document("_id", -1)),
		        new Document("$limit", 1)
		        ));
		Date latest = null;
		for (Document dbObject : output) {
			latest = (Date) dbObject.get("t"); // java.util.Date
		}
		return latest;
	}

	public JSONObject getTrends(int number) throws JSONException {
		Date latest = getLatestTime();
		MongoCollection<Document> c = db.getCollection("trends");
		FindIterable<Document> ts = c.find(eq("crawled_time", latest))
				.projection(new Document("_id", 0)
						.append("name", 1)
						.append("url", 1)
						.append("tweet_volume", 1)
						.append("crawled_order", 1))
				.sort(new Document("crawled_order", 1))
				.limit(number);
		JSONArray ls = new JSONArray();
		for (Document d : ts) {
//			System.out.println(d);
			ls.put(new JSONObject(d.toJson()));
		}
		JSONObject res = new JSONObject();
		res.put("time_updated", latest)
			.put("trends", ls);
		return res;
	}
	
	public static void main(String[] args) throws JSONException {
		MongoDBConnection conn = new MongoDBConnection();
		conn.getTrends(9);
	}
}