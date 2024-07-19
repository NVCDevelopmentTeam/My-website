import database from '$lib/data/database';

export async function GET() {
  const comments = database.getComments();
  return new Response(JSON.stringify(comments), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST({ request }) {
  const comment = await request.json();
  const newComment = database.addComment(comment);

  return new Response(JSON.stringify(newComment), {
    status: 201,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function DELETE({ params }) {
  const { id } = params;
  database.deleteComment(Number(id));

  return new Response(null, {
    status: 204
  });
}
